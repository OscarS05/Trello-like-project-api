const WorkspaceMemberDto = require("../../dtos/workspaceMember.dto");

class GetWorkspaceMemberByIdUseCase {
  constructor({ workspaceMemberRepository }){
    this.workspaceMemberRepository = workspaceMemberRepository;
  }

  async execute(workspaceMemberId){
    const workspaceMember = await this.workspaceMemberRepository.findWorkspaceMemberById(workspaceMemberId);
    return workspaceMember?.id ? new WorkspaceMemberDto(workspaceMember) : {};
  }
}

module.exports = GetWorkspaceMemberByIdUseCase;
