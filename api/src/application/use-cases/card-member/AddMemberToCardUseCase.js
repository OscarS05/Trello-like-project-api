const CardMemberEntity = require('../../../domain/entities/CardMemberEntity');
const CardMemberDto = require('../../dtos/card-member.dto');

class AddMemberToCardUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId, projectMemberId) {
    if (!cardId) throw new Error('cardId was not provided');
    if (!projectMemberId) throw new Error('projectMemberId was not provided');

    const cardMemberEntity = new CardMemberEntity({ cardId, projectMemberId });
    const newMember = await this.cardMemberRepository.create(cardMemberEntity);

    if (!newMember?.id) {
      throw new Error('Something went wrong adding the member');
    }

    return new CardMemberDto(newMember);
  }
}

module.exports = AddMemberToCardUseCase;
