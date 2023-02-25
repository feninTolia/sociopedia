import User from '../models/User.js';

// READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formatedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePAth }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePAth,
        };
      }
    );
    res.status(200).json(formatedFriends);
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};

// UPDATE

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends.filter((id) => id !== friendId);
      friend.friends.filter((ID) => ID !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formatedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePAth }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePAth,
        };
      }
    );
    res.status(200).json(formatedFriends);
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};
