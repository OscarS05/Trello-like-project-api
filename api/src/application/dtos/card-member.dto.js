class CardMemberDto {
  constructor({ id, projectMember, projectMemberId, cardId, createdAt }) {
    this.id = id;
    if (projectMember)
      this.name = projectMember?.workspaceMember?.user?.name || null;
    this.projectMemberId = projectMemberId;
    this.cardId = cardId;
    this.createdAt = createdAt;
  }
}

module.exports = CardMemberDto;
