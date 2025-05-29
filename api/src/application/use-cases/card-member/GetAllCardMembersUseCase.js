const CardMemberDto = require('../../dtos/card-member.dto');

class GetAllCardMembersUseCase {
  constructor({ cardMemberRepository }) {
    this.cardMemberRepository = cardMemberRepository;
  }

  async execute(cardId) {
    if (!cardId) throw new Error('cardId was not provided');

    const cardMembers = await this.cardMemberRepository.findAll(cardId);
    return cardMembers?.length > 0
      ? cardMembers.map((member) => new CardMemberDto(member))
      : [];
  }
}

module.exports = GetAllCardMembersUseCase;
