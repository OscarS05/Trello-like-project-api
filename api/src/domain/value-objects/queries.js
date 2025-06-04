const boom = require('@hapi/boom');

class QueryVO {
  constructor({ limit, offset, role, isVerified, ...rest } = {}) {
    if (Object.keys(rest).length > 0) {
      throw boom.badRequest(
        `Unknown query parameters: ${Object.keys(rest).join(', ')}`,
      );
    }

    if (Number.isNaN(limit) || limit < 0)
      throw boom.badRequest('Invalid limit');
    if (Number.isNaN(offset) || offset < 0)
      throw boom.badRequest('Invalid offset');

    if (isVerified !== undefined && typeof isVerified !== 'boolean') {
      throw boom.badRequest('Invalid isVerified');
    }
    if (role && !['admin', 'basic', 'premium'].includes(role)) {
      throw boom.badRequest('Invalid role');
    }

    if (limit) this.limit = Number(limit);
    if (offset) this.offset = Number(offset);
    if (role) this.role = role;
  }

  toObject() {
    return {
      ...(this.limit !== undefined && { limit: this.limit }),
      ...(this.offset !== undefined && { offset: this.offset }),
      ...(this.role && { role: this.role }),
      ...(this.isVerified !== undefined && { isVerified: this.isVerified }),
    };
  }
}

module.exports = QueryVO;
