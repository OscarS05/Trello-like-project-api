const { USER_TABLE } = require('../models/user.model');
const { WORKSPACE_TABLE } = require('../models/workspace.model');
const { WORKSPACE_MEMBER_TABLE } = require('../models/workspace-member.model');
const { PROJECT_TABLE } = require('../models/project.model');
const { PROJECT_MEMBER_TABLE } = require('../models/project-member.model');
const { TEAM_TABLE } = require('../models/team.model');
const { TEAM_MEMBER_TABLE } = require('../models/team-member.model');
const { PROJECT_TEAM_TABLE } = require('../models/project-team.model');
const { LIST_TABLE } = require('../models/list.model');
const { CARD_TABLE } = require('../models/card.model');
const { CARD_MEMBER_TABLE } = require('../models/card-member.model');
const { CARD_ATTACHMENT_TABLE } = require('../models/card-attachment.model');
const { LABEL_TABLE } = require('../models/label.model');
const { CARD_LABELS_TABLE } = require('../models/card-labels.model');
const { CHECKLIST_TABLE } = require('../models/checklist.model');
const { CHECKLIST_ITEM_TABLE } = require('../models/checklist-item.model');
const {
  CHECKLIST_ITEM_MEMBER_TABLE,
} = require('../models/checklist-item-members.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      recoveryToken: {
        field: 'recovery_token',
        allowNull: true,
        type: Sequelize.STRING,
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'basic',
      },
      isVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        field: 'is_verified',
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(WORKSPACE_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      userId: {
        field: 'user_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(WORKSPACE_MEMBER_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      userId: {
        field: 'user_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'member',
      },
      workspaceId: {
        field: 'workspace_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'added_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(PROJECT_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      visibility: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      backgroundUrl: {
        field: 'background_url',
        allowNull: false,
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      workspaceId: {
        field: 'workspace_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      workspaceMemberId: {
        field: 'workspace_member_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_MEMBER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(PROJECT_MEMBER_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      workspaceMemberId: {
        field: 'workspace_member_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_MEMBER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'member',
      },
      projectId: {
        field: 'project_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: PROJECT_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'added_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(TEAM_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      workspaceMemberId: {
        field: 'workspace_member_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_MEMBER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      workspaceId: {
        field: 'workspace_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(PROJECT_TEAM_TABLE, {
      teamId: {
        field: 'team_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: TEAM_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      projectId: {
        field: 'project_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: PROJECT_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(TEAM_MEMBER_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      workspaceMemberId: {
        field: 'workspace_member_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_MEMBER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'member',
      },
      workspaceId: {
        field: 'workspace_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: WORKSPACE_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      teamId: {
        field: 'team_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: TEAM_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'added_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(LIST_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      projectId: {
        field: 'project_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: PROJECT_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(CARD_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      listId: {
        field: 'list_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: LIST_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(CARD_MEMBER_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      projectMemberId: {
        field: 'project_member_id',
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: PROJECT_MEMBER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cardId: {
        field: 'card_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: CARD_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'added_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(CARD_ATTACHMENT_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      filename: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      url: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      publicId: {
        field: 'public_id',
        allowNull: true,
        type: Sequelize.STRING,
      },
      cardId: {
        field: 'card_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: CARD_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(LABEL_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      projectId: {
        field: 'project_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: PROJECT_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
    await queryInterface.createTable(CARD_LABELS_TABLE, {
      cardId: {
        field: 'card_id',
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: CARD_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      labelId: {
        field: 'label_id',
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: LABEL_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      isVisible: {
        field: 'is_visible',
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    await queryInterface.createTable(CHECKLIST_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cardId: {
        field: 'card_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: CARD_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(CHECKLIST_ITEM_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      checklistId: {
        field: 'checklist_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: CHECKLIST_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      isChecked: {
        field: 'is_checked',
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dueDate: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'due_date',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(CHECKLIST_ITEM_MEMBER_TABLE, {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      projectMemberId: {
        field: 'project_member_id',
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: PROJECT_MEMBER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      checklistItemId: {
        field: 'checklist_item_id',
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: CHECKLIST_ITEM_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      addedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'added_at',
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(CHECKLIST_ITEM_MEMBER_TABLE);
    await queryInterface.dropTable(CHECKLIST_ITEM_TABLE);
    await queryInterface.dropTable(CHECKLIST_TABLE);
    await queryInterface.dropTable(CARD_LABELS_TABLE);
    await queryInterface.dropTable(LABEL_TABLE);
    await queryInterface.dropTable(CARD_ATTACHMENT_TABLE);
    await queryInterface.dropTable(CARD_MEMBER_TABLE);
    await queryInterface.dropTable(CARD_TABLE);
    await queryInterface.dropTable(LIST_TABLE);
    await queryInterface.dropTable(TEAM_MEMBER_TABLE);
    await queryInterface.dropTable(PROJECT_TEAM_TABLE);
    await queryInterface.dropTable(TEAM_TABLE);
    await queryInterface.dropTable(PROJECT_MEMBER_TABLE);
    await queryInterface.dropTable(PROJECT_TABLE);
    await queryInterface.dropTable(WORKSPACE_MEMBER_TABLE);
    await queryInterface.dropTable(WORKSPACE_TABLE);
    await queryInterface.dropTable(USER_TABLE);
  },
};
