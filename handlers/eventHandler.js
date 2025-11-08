import Event from '../model/event.js'
import { generateUniqueId } from "../utils/UniqueIdGenerator.js";

const authorisedTeams = ['team_web', 'team_technical', 'team_event', 'team_leaders']

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Events fetched successfully",
      data: events.map((event) => {
        return {
          id: event._id,
          eventId: event.eventId,
          title: event.title,
          shortDescription: event.shortDescription,
          description: event.description,
          mode: event.mode,
          entryFee: event.entryFee,
          prize: event.prize,
          thumbnail: event.thumbnailURL,
          registrationLink: event.registrationLink,
          eventStartDateTime: event.eventStartDateTime,
          eventEndDateTime: event.eventEndDateTime,
          status: event.status,
          isUpcoming: event.isUpcoming,
          isOngoing: event.isOngoing,
          isEnded: event.isEnded
        }
      })
    });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({eventId: req.params.id});
    
    if (!event) {
      return res.status(404).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "Event not found",
        data: null
      });
    }

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Event fetched successfully",
      data: {
        id: event._id,
        eventId: event.eventId,
        title: event.title,
        shortDescription: event.shortDescription,
        description: event.description,
        mode: event.mode,
        entryFee: event.entryFee,
        prize: event.prize,
        thumbnail: event.thumbnailURL,
        registrationLink: event.registrationLink,
        eventStartDateTime: event.eventStartDateTime,
        eventEndDateTime: event.eventEndDateTime,
        status: event.status,
        isUpcoming: event.isUpcoming,
        isOngoing: event.isOngoing,
        isEnded: event.isEnded
      }
    });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const createEvent = async (req, res) => {
  try {
    if(!authorisedTeams.includes(req.member.team)){
      return res.status(401).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: "unauthorized request",
      data: null
    });
    }
    const event = new Event(req.body);
    const eventId = generateUniqueId({prefix: "EVENT", alphanumeric: true});
    event.eventId = eventId;
    
    if (req.body.photoURL) {
      event.thumbnailURL = req.body.photoURL;
    }
    
    await event.save();

    const eventData = {
      eventId: event.eventId,
      title: event.title,
      shortDescription: event.shortDescription,
      description: event.description,
      mode: event.mode,
      entryFee: event.entryFee,
      prize: event.prize,
      thumbnail: event.thumbnailURL,
      registrationLink: event.registrationLink,
      eventStartDateTime: event.eventStartDateTime,
      eventEndDateTime: event.eventEndDateTime,
      status: event.status
    };
    
    return res.status(201).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Event created successfully",
      data: eventData
    });
  } catch (error) {
    return res.status(400).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    if(!authorisedTeams.includes(req.member.team)){
      return res.status(401).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: "unauthorized request",
      data: null
    });
    }
    const event = await Event.findOne({eventId: req.params.id}).exec();
    const {
      title,
      shortDescription,
      description,
      mode,
      entryFee,
      prize,
      registrationLink,
      photoURL,
      thumbnailURL,
      eventStartDateTime,
      eventEndDateTime
    } = req.body;

    if (!event) {
      return res.status(404).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "Event not found",
        data: null
      });
    }

    if (title !== null && title !== undefined) { event.title = title; }
    if (shortDescription !== null && shortDescription !== undefined) { event.shortDescription = shortDescription; }
    if (description !== null && description !== undefined) { event.description = description; }
    if (mode !== null && mode !== undefined) { event.mode = mode; }
    if (entryFee !== null && entryFee !== undefined) { event.entryFee = entryFee; }
    if (prize !== null && prize !== undefined) { event.prize = prize; }
    if (registrationLink !== null && registrationLink !== undefined) { event.registrationLink = registrationLink; }
    if (photoURL !== null && photoURL !== undefined) { event.thumbnailURL = photoURL; }
    if (thumbnailURL !== null && thumbnailURL !== undefined) { event.thumbnailURL = thumbnailURL; }
    if (eventStartDateTime !== null && eventStartDateTime !== undefined) { event.eventStartDateTime = eventStartDateTime; }
    if (eventEndDateTime !== null && eventEndDateTime !== undefined) { event.eventEndDateTime = eventEndDateTime; }

    await event.save();

    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Event updated successfully",
      data: {
        id: event._id,
        eventId: event.eventId,
        title: event.title,
        shortDescription: event.shortDescription,
        description: event.description,
        mode: event.mode,
        entryFee: event.entryFee,
        prize: event.prize,
        thumbnail: event.thumbnailURL,
        registrationLink: event.registrationLink,
        eventStartDateTime: event.eventStartDateTime,
        eventEndDateTime: event.eventEndDateTime,
        status: event.status,
        isUpcoming: event.isUpcoming,
        isOngoing: event.isOngoing,
        isEnded: event.isEnded
      }
    });
  } catch (error) {
    return res.status(400).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    if(!authorisedTeams.includes(req.member.team)){
      return res.status(401).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: "unauthorized request",
      data: null
    });
    }
    const deleted = await Event.findOneAndDelete({eventId: req.params.id});
    if (!deleted) {
      return res.status(404).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "Event not found",
        data: null
      });
    }
    return res.status(200).json({
      path: req.url,
      timestamp: new Date(),
      success: true,
      message: "Event deleted successfully",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Un-implemented method, will implement later
export const getEventsInPublicFormat = async (req, res) => {
  try {
    const events = await Event.find();
  } catch (error) {
    
  }
}