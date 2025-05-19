class ChecklistItemMemberDto {
  constructor({
    id,
    name,
    checklistItemId,
    projectMember,
    projectMemberId,
    addedAt,
  }) {
    this.id = id;
    this.name = name;
    if (projectMember) this.name = projectMember?.workspaceMember?.user?.name;
    this.checklistItemId = checklistItemId;
    this.projectMemberId = projectMemberId;
    this.addedAt = addedAt;
  }
}

module.exports = ChecklistItemMemberDto;
