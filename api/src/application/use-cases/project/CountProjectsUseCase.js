class CountProjectsUseCase {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async execute(workspaceMemberId) {
    return this.projectRepository.countProjects(workspaceMemberId);
  }
}

module.exports = CountProjectsUseCase;
