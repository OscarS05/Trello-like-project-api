const ICardMemberRepository = require('../../../domain/repositories/db/ICardMemberRepository');

class CardMemberRepository extends ICardMemberRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(cardEntity) {
    return this.db.models.CardMember.create(cardEntity);
  }

  async delete(cardId, projectMemberId) {
    return this.db.models.CardMember.destroy({
      where: { cardId, projectMemberId },
    });
  }

  async findOne(cardId, cardMemberId) {
    return this.db.models.CardMember.findOne({
      where: { cardId, id: cardMemberId },
      include: [
        {
          model: this.db.models.ProjectMember,
          as: 'projectMember',
          attributes: ['id'],
          include: [
            {
              model: this.db.models.WorkspaceMember,
              as: 'workspaceMember',
              attributes: ['id'],
              include: [
                {
                  model: this.db.models.User,
                  as: 'user',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async findAll(cardId) {
    return this.db.models.CardMember.findAll({
      where: { cardId },
      include: [
        {
          model: this.db.models.ProjectMember,
          as: 'projectMember',
          attributes: ['id'],
          include: [
            {
              model: this.db.models.WorkspaceMember,
              as: 'workspaceMember',
              attributes: ['id'],
              include: [
                {
                  model: this.db.models.User,
                  as: 'user',
                  attributes: ['id', 'name', 'email'],
                },
              ],
            },
          ],
        },
      ],
    });
  }
}

module.exports = CardMemberRepository;
