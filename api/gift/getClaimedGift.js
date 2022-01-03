const ClaimedCooperateGift = require('../../models/ClaimedCooperativeGift');

module.exports = async (req, res) => {
  const { platformId:cooperativeId } = req.user;
  const { userId } = req.query; 

  const condition = {cooperativeId};
  
  if (userId) {
    condition['user.id'] = userId;
  }

  const cooperatives = await ClaimedCooperateGift.find(condition);
  return res.send(cooperatives);
};
