const LabelDTO = require('../../dtos/label.dto');

class GetAllLabelsUseCase {
  constructor({ labelRepository }) {
    this.labelRepository = labelRepository;
  }

  async execute(projectId) {
    if (!projectId) throw new Error('projectId was not provided');

    const labels = await this.labelRepository.findAll(projectId);
    return labels.length > 0 ? labels.map((label) => new LabelDTO(label)) : [];
  }
}

module.exports = GetAllLabelsUseCase;
