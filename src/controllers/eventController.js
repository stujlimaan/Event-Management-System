const eventModel = require("../models/eventModel");
const userModel = require("../models/userModel");
const validator = require("../utilities/validations");
const moment = require("moment");

const createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const userId = req.token.userId;
    if (!validator.isValidBody(eventData)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter some data" });
    }

    let {
      eventId,
      eventName,
      summary,
      address,
      startDate,
      endDate,
      fullDesc,
      capacity,
      currentBooking,
      promocode,
      discount,
      price,
    } = eventData;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (!validator.isValidNumber(eventId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter eventId" });
    }

    if (!validator.isValidInputValue(eventName)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter event name" });
    }
    if (!validator.isValidInputValue(summary)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter summary" });
    }
    if (!validator.isValidInputValue(address)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter address" });
    }
    if (!startDate) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter start date" });
    }
    if (!endDate) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter end date" });
    }
    if (!validator.isValidInputValue(fullDesc)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter full descr" });
    }
    if (!validator.isValidNumber(capacity)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter capacity" });
    }
    if (!validator.isValidNumber(currentBooking)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter current booking" });
    }
    if (!validator.isValidInputValue(promocode)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter promocode " });
    }
    if (!validator.isValidNumber(discount)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter discount" });
    }
    if (!validator.isValidNumber(price)) {
      return res.status(400).send({ status: false, msg: "please enter price" });
    }

    userCreated={...eventData,userId:userId}
    const event = await eventModel.create(userCreated);
    const userEvent = await userModel.findByIdAndUpdate({ _id: userId },
      {
        $push: {
          history: {
            action: `Created event <a href="/event/id/${event.eventId}">${event.eventName}</a>`,
            time: Date.now(),
          },
        },
      },
      { new: true }
    );
    res
      .status(201)
      .send({
        status: false,
        msg: "event created successfully",
        event,
        userEvent,
      });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const inviteUser = async (req, res) => {
  try {
        const userId = req.token.userId
        const requestBody=req.body
        let {invitedEmail}=requestBody
        let eventId = req.params.eventId

        if(!validator.isValidInputValue(invitedEmail)){
            return res.status(400).send({status:false,msg:"please enter invited email id"})
        }
        if(!validator.isValidEmail(invitedEmail)){
            return res.status(400).send({status:false,msg:"please enter invited email id"})
        }


        let logggedUser = await userModel.findOne({_id:userId})
        const fullName = logggedUser.firstName+" "+logggedUser.lastName

        let inviteUserFound = await userModel.findOne({email:invitedEmail})
        if(!inviteUserFound){
            return res.status(404).send({status:false,msg:"invite user not found please check his email id"})
        }

        let eventDetails = await eventModel.find({userId,eventId})
        const Invited = await userModel.findOneAndUpdate({},{
            $push: {
                InvitedUser : {
                userName:fullName,
                link: `Created event <a href="/event/id/${eventDetails.eventId}">${eventDetails.eventName}</a>`
              },
            },
          },
          { new: true })

    res.status(201).send({ status: false, msg: "" ,data:Invited });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const list = async (req, res) => {
  try {
    const queryParams = req.query;
    const search = {};
    let {
      eventName,
      summary,
      address,
      startDate,
      endDate,
      fullDesc,
      capacity,
      currentBooking,
      promocode,
      discount,
      price,
    } = queryParams;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const resultPerPage=2
    let page = req.params.page >=1?req.params.page:1
    page = page -1

    if (validator.isValidBody(queryParams)) {

      if (queryParams.hasOwnProperty("eventName")) {
        if (!validator.isValidInputValue(eventName)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter event name" });
        }
        search["eventName"] = eventName;
      }
      if (queryParams.hasOwnProperty("summary")) {
        if (!validator.isValidInputValue(summary)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter summary" });
        }
        search["summary"] = summary.trim();
      }
      if (queryParams.hasOwnProperty("address")) {
        if (!validator.isValidInputValue(address)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter address" });
        }
        search["address"] = address.trim();
      }
      if (queryParams.hasOwnProperty("startDate")) {
        if (!startDate) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter start date" });
        }
        search["startDate"] = startDate.trim();
      }

      if (queryParams.hasOwnProperty("endDate")) {
        if (!endDate) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter end date" });
        }
        search["endDate"] = endDate.trim();
      }
      if (queryParams.hasOwnProperty("fullDesc")) {
        if (!validator.isValidInputValue(fullDesc)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter full descr" });
        }
        search["fullDesc"] = fullDesc.trim();
      }

      if (queryParams.hasOwnProperty("capacity")) {
        if (!validator.isValidNumber(capacity)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter capacity" });
        }
        search["capacity"] = capacity.trim();
      }

      if (queryParams.hasOwnProperty("currentBooking")) {
        if (!validator.isValidNumber(currentBooking)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter current booking" });
        }
        search["currentBooking"] = currentBooking.trim();
      }
      if (queryParams.hasOwnProperty("promocode")) {
        if (!validator.isValidInputValue(promocode)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter promocode " });
        }
        search["promocode"] = promocode.trim();
      }
      if (queryParams.hasOwnProperty("discount")) {
        if (!validator.isValidNumber(discount)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter discount" });
        }
        search["discount"] = discount.trim();
      }
      if (queryParams.hasOwnProperty("price")) {
        if (!validator.isValidNumber(price)) {
          return res
            .status(400)
            .send({ status: false, msg: "please enter price" });
        } else {
          search["price"] = price.trim();
        }
      }
    }

    const list = await eventModel.find(search).select("price").sort({price:1}).limit(resultPerPage).skip(resultPerPage*page);
    res.status(200).send({ status: true, msg: "list of events", data: list });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};


const eventDetails = async (req, res) => {
  try {

    const eventDetails = await eventModel.find()
    res.status(201).send({ status: false, msg: "event details and list of user invited" ,eventDetails});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const eventUpdate = async (req, res) => {
  try {
    const requestBody = { ...req.body };
    const eventId = req.params.eventId;

    if (!validator.isValidBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter some data" });
    }
    if (!validator.isValidInputValue(eventId)) {
      return res
        .status(400)
        .send({ status: false, msg: "please enter event id" });
    }

    const isEvent = await eventModel.findOne({ eventId });
    if (!isEvent) {
      return res
        .status(404)
        .send({ status: false, msg: "not found any event" });
    }
    let {
      eventName,
      summary,
      address,
      startDate,
      endDate,
      fullDesc,
      capacity,
      currentBooking,
      promocode,
      discount,
      price,
    } = requestBody;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    const updates = { $set: {} };

    if (requestBody.hasOwnProperty("eventName")) {
      if (!validator.isValidInputValue(eventName)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter event name" });
      }
      updates["$set"]["eventName"] = eventName;
    }
    if (requestBody.hasOwnProperty("summary")) {
      if (!validator.isValidInputValue(summary)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter summary" });
      }
      updates["$set"]["summary"] = summary.trim();
    }
    if (requestBody.hasOwnProperty("address")) {
      if (!validator.isValidInputValue(address)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter address" });
      }
      updates["$set"]["address"] = address.trim();
    }
    if (requestBody.hasOwnProperty("startDate")) {
      if (!startDate) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter start date" });
      }
      updates["$set"]["startDate"] = startDate.trim();
    }

    if (requestBody.hasOwnProperty("endDate")) {
      if (!endDate) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter end date" });
      }
      updates["$set"]["endDate"] = endDate.trim();
    }
    if (requestBody.hasOwnProperty("fullDesc")) {
      if (!validator.isValidInputValue(fullDesc)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter full descr" });
      }
      updates["$set"]["fullDesc"] = fullDesc.trim();
    }

    if (requestBody.hasOwnProperty("capacity")) {
      if (!validator.isValidNumber(capacity)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter capacity" });
      }
      updates["$set"]["capacity"] = capacity.trim();
    }

    if (requestBody.hasOwnProperty("currentBooking")) {
      if (!validator.isValidNumber(currentBooking)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter current booking" });
      }
      updates["$set"]["currentBooking"] = currentBooking.trim();
    }
    if (requestBody.hasOwnProperty("promocode")) {
      if (!validator.isValidInputValue(promocode)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter promocode " });
      }
      updates["$set"]["promocode"] = promocode.trim();
    }
    if (requestBody.hasOwnProperty("discount")) {
      if (!validator.isValidNumber(discount)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter discount" });
      }
      updates["$set"]["discount"] = discount.trim();
    }
    if (requestBody.hasOwnProperty("price")) {
      if (!validator.isValidNumber(price)) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter price" });
      } else {
        updates["$set"]["price"] = price.trim();
      }
    }
    const updatedEvent = await eventModel.findOneAndUpdate(
      { eventId: eventId },
      updates,
      { new: true }
    );
    res
      .status(200)
      .send({
        status: true,
        msg: "event updated successfully",
        data: updatedEvent,
      });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createEvent, inviteUser, list, eventDetails, eventUpdate};
