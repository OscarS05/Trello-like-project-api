const CardMemberEntity = require('../../../domain/entities/CardMemberEntity');
const CardMemberDto = require('../../dtos/card-member.dto');

class AddMemberToCardUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId, projectMemberId) {
    const cardMemberEntity = new CardMemberEntity({ cardId, projectMemberId });
    const newMember = await this.cardMemberRepository.create(cardMemberEntity);
    return new CardMemberDto(newMember);
  }
}

module.exports = AddMemberToCardUseCase;
