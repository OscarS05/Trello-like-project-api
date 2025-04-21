const ICardMemberRepository = require('../../../domain/repositories/db/ICardMemberRepository');

class CardMemberRepository extends ICardMemberRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(cardEntity){
    return await this.db.models.CardMember.create(cardEntity);
  }

  async delete(cardId, projectMemberId){
    return await this.db.models.CardMember.destroy({ where: { cardId, projectMemberId } });
  }

  async findAll(cardId){
    return await this.db.models.CardMember.findAll({
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
