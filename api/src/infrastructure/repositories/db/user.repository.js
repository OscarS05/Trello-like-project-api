const IUserRepository = require('../../../domain/repositories/db/IUserRepository');

class UserRepository extends IUserRepository {
  constructor(db){
    super();
    this.db = db;
  }

  async findByEmailToLogin(email){
    return await this.db.models.User.findOne({
      where: { email },
      attributes:  { exclude: ['recoveryToken']  }
    });
  }

  async findByEmail(email) {
    return await this.db.models.User.findOne({
      where: { email },
      attributes:  { exclude: ['password', 'recoveryToken']  }
    });
  }

  async findAll() {
    return await this.db.models.User.findAll({
      attributes:  { exclude: ['password', 'recoveryToken']  }
    });
  }

  async create(userData) {
    return await this.db.models.User.create(userData,
      { attributes:  { exclude: ['password', 'recoveryToken']  } }
    );
  }

  async findById(userId) {
    return await this.db.models.User.findByPk(userId,
      { attributes:  { exclude: ['password', 'recoveryToken']  } }
    );
  }

  async delete(userId) {
    return await this.db.models.User.destroy({
      where: { id: userId }
    });
  }

  async update(id, userData){
    return await this.db.models.User.update(userData,
      { where: { id } }
    );
  }

  async findAllWorkspacesByUserId(userId){
    return await this.db.models.User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password', 'recoveryToken'] },
      include: {
        model: this.db.models.Workspace,
        as: 'workspaces',
        through: { attributes: [] },
        include: [
          {
            model: this.db.models.WorkspaceMember,
            as: 'workspaceMembers',
          },
          {
            model: this.db.models.Project,
            as: 'projects',
            include: [{
              model: this.db.models.ProjectMember,
              as: 'projectMembers',

            }]
          },
          {
            model: this.db.models.Team,
            as: 'teams',
            include: [{
              model: this.db.models.TeamMember,
              as: 'teamMembers',
            }]
          }
        ]
      }
    });
  }
}

module.exports = UserRepository;
