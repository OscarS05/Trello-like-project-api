const CardMemberDto = require('../../dtos/card-member.dto');

class GetCardMemberUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId, cardMemberId) {
    if (!cardId) throw new Error('cardId was not provided');
    if (!cardMemberId) throw new Error('cardMemberId was not provided');

    const cardMember = await this.cardMemberRepository.findOne(
      cardId,
      cardMemberId,
    );

    return cardMember?.id ? new CardMemberDto(cardMember) : {};
  }
}

module.exports = GetCardMemberUseCase;
