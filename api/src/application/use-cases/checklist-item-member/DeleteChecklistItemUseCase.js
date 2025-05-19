class DeleteChecklistItemUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId, projectMemberId) {
    return this.checklistItemMemberRepository.delete(
      checklistItemId,
      projectMemberId,
    );
  }
}

module.exports = DeleteChecklistItemUseCase;
