const ContactMessage = require('../models/ContactMessage');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const AboutUs = require('../models/AboutUs');
const { sendReplyEmail } = require('../src/utils/emailService');

const getCompanyInfo = async () => {
  try {
    const about = await AboutUs.findOne();
    if (!about || !about.contactMethods || about.contactMethods.length === 0) {
      return {};
    }

    const emailContact = about.contactMethods.find((c) => c.label === 'Email');
    const phoneContact = about.contactMethods.find((c) => c.label === 'Phone');
    const locationContact = about.contactMethods.find((c) => c.label === 'Location');

    return {
      companyName: about.title || 'RSK Associates',
      companyAddress: locationContact ? locationContact.value : 'KIMIRONKO, KG 11 Ave, Kigali',
      companyPhone: phoneContact ? phoneContact.value : '+250 788 492 529',
    };
  } catch (error) {
    return {};
  }
};

// Find or create conversation by email
const findOrCreateConversation = async (name, email) => {
  let conversation = await Conversation.findOne({ clientEmail: email.toLowerCase() });
  
  if (!conversation) {
    conversation = await Conversation.create({
      clientName: name,
      clientEmail: email.toLowerCase(),
    });
  }
  
  return conversation;
};

const createContactMessage = async (req, res) => {
  const { name, email, message } = req.body;
  
  // Find or create conversation
  const conversation = await findOrCreateConversation(name, email);
  
  // Create client message
  const newMessage = await Message.create({
    conversation: conversation._id,
    sender: 'client',
    message: message.trim(),
    read: false,
  });
  
  // Update conversation
  conversation.lastMessage = message.trim();
  conversation.lastMessageAt = new Date();
  conversation.unreadCount = (conversation.unreadCount || 0) + 1;
  await conversation.save();
  
  // Also create a ContactMessage for backward compatibility
  const contactMessage = await ContactMessage.create({
    name,
    email,
    message: message.trim(),
  });
  
  return res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: { 
      conversation,
      message: newMessage,
      contactMessage 
    },
  });
};

const getConversations = async (req, res) => {
  const conversations = await Conversation.find().sort({ lastMessageAt: -1 });
  
  // Get unread count for each conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadMessages = await Message.countDocuments({
        conversation: conv._id,
        sender: 'client',
        read: false,
      });
      return {
        ...conv.toObject(),
        unreadCount: unreadMessages,
      };
    })
  );
  
  return res.status(200).json({
    success: true,
    message: 'Conversations retrieved successfully',
    data: { conversations: conversationsWithUnread },
  });
};

const getConversation = async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found',
      errors: ['No conversation found with this ID'],
    });
  }
  
  // Get all messages for this conversation
  const messages = await Message.find({ conversation: conversation._id })
    .sort({ createdAt: 1 });
  
  // Mark all client messages as read
  await Message.updateMany(
    { conversation: conversation._id, sender: 'client', read: false },
    { read: true, readAt: new Date() }
  );
  
  // Update conversation unread count
  conversation.unreadCount = 0;
  await conversation.save();
  
  return res.status(200).json({
    success: true,
    message: 'Conversation retrieved successfully',
    data: { 
      conversation: {
        ...conversation.toObject(),
        messages,
      },
    },
  });
};

const sendMessage = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  
  const conversation = await Conversation.findById(id);
  
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found',
      errors: ['No conversation found with this ID'],
    });
  }
  
  // Create admin message
  const newMessage = await Message.create({
    conversation: conversation._id,
    sender: 'admin',
    message: message.trim(),
    read: true,
    readAt: new Date(),
  });
  
  // Update conversation
  conversation.lastMessage = message.trim();
  conversation.lastMessageAt = new Date();
  await conversation.save();
  
  // Send email to client
  const companyInfo = await getCompanyInfo();
  try {
    await sendReplyEmail(
      conversation.clientEmail,
      `Re: Your Message to ${companyInfo.companyName || 'RSK Associates'}`,
      message.trim(),
      companyInfo
    );
  } catch (error) {
    console.error('Error sending reply email:', error);
  }
  
  return res.status(200).json({
    success: true,
    message: 'Message sent successfully',
    data: { message: newMessage, conversation },
  });
};

const getContactMessages = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message: 'Contact messages retrieved successfully',
    data: { messages },
  });
};

const getContactMessage = async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found',
      errors: ['No message found with this ID'],
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Message retrieved successfully',
    data: { message },
  });
};

const deleteContactMessage = async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found',
      errors: ['No message found with this ID'],
    });
  }

  await message.deleteOne();

  return res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
    data: {},
  });
};

const replyToMessage = async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found',
      errors: ['No message found with this ID'],
    });
  }

  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Reply is required',
      errors: ['Please provide a reply message'],
    });
  }

  message.reply = reply.trim();
  message.replyAt = new Date();
  message.repliedBy = req.user ? req.user._id : null;
  message.status = 'replied';

  await message.save();

  const companyInfo = await getCompanyInfo();

  try {
    await sendReplyEmail(message.email, 'Re: Your Message to RSK Associates', reply, companyInfo);
  } catch (error) {
    console.error('Error sending reply email:', error);
  }

  return res.status(200).json({
    success: true,
    message: 'Reply sent successfully',
    data: { message },
  });
};

module.exports = {
  createContactMessage,
  getConversations,
  getConversation,
  sendMessage,
  getContactMessages,
  getContactMessage,
  deleteContactMessage,
  replyToMessage,
};
