const CardMemberDto = require('../../dtos/card-member.dto');

class GetCardMemberUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId, cardMemberId) {
    const cardMember = await this.cardMemberRepository.findOne(
      cardId,
      cardMemberId,
    );
    return !cardMember?.id ? null : new CardMemberDto(cardMember);
  }
}

module.exports = GetCardMemberUseCase;
