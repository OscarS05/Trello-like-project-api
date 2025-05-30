const ChecklistItemMemberDto = require('../../dtos/checklist-item-member.dto');

class GetAllItemMembersUseCase {
  constructor({ checklistItemMemberRepository }) {
    this.checklistItemMemberRepository = checklistItemMemberRepository;
  }

  async execute(checklistItemId) {
    if (!checklistItemId) throw new Error('checklistItemId was not provided');

    const checklistItemMembers =
      await this.checklistItemMemberRepository.findAll(checklistItemId);

    return checklistItemMembers?.length > 0
      ? checklistItemMembers.map((m) => {
          const formattedMembers = m?.get ? m.get({ plain: true }) : m;
          return new ChecklistItemMemberDto({
            ...formattedMembers,
            name:
              formattedMembers.projectMember?.workspaceMember?.user?.name ||
              null,
          });
        })
      : [];
  }
}

module.exports = GetAllItemMembersUseCase;
