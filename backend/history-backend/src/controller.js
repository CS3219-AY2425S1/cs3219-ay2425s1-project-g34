import { isValidObjectId } from 'mongoose';
import HistoryModel from './model.js';

export async function getHistory(req, res) {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id))
      return res.status(404).json({ message: `History ${id} not found` });

    const history = await HistoryModel.findById(id);
    if (!history)
      return res.status(404).json({ message: `User ${id} not found` });

    return res.status(200).json({
      message: `Found history`,
      data: history,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting history!" });
  }

}

export async function getSomeHistory(req, res) {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ message: "Invalid or missing ids field"});

  try {
    const histories = await HistoryModel.find({ _id: { $in: ids }});
    return res.status(200).json({
      message: "Found history",
      data: histories,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unknown error when getting history!" });
  }
}

export async function addHistory(req, res) {
  const { roomId, question, user, partner, status, datetime, solution, language } = req.body;

  if (!(roomId && question && user && partner && status && datetime))
    return res.status(400).json({ message: "Missing one or more of the required fields" });

  try {
    let newHistory = { roomId, question, user, partner, status, datetime, solution, language };

    const existingHistory = await _getHistoryByRoomIdAndUser(roomId, user);
    if (existingHistory)
      newHistory = await _updateHistory(existingHistory.id, newHistory);
    else
      newHistory = await new HistoryModel(newHistory).save();
  
    return res.status(200).json({
      message: "Successfully added question history",
      data: newHistory,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unknown error when adding history!" });
  }
}

export async function deleteHistory(req, res) {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id))
      return res.status(404).json({ message: `History ${id} not found` });

    const history = await HistoryModel.findById(id);
    if (!history)
      return res.status(404).json({ message: `User ${id} not found` });

    await HistoryModel.findByIdAndDelete(id);
    return res.status(200).json({ message: `History ${id} successfully deleted` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unknown error when getting history!" });
  }
}

async function _getHistoryByRoomIdAndUser(roomId, user) {
  return HistoryModel.findOne({
    $and: [
      { roomId },
      { user },
    ],
  });
}

async function _updateHistory(id, newHistory) {
  return HistoryModel.findByIdAndUpdate(
    id,
    { $set: newHistory },
    { new: true },
  );
}
