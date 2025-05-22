class QueryVO {
  constructor({ limit, offset, role, isVerified, ...rest } = {}) {
    if (Object.keys(rest).length > 0) {
      throw new Error(
        `Unknown query parameters: ${Object.keys(rest).join(', ')}`,
      );
    }

    if (Number.isNaN(limit) || limit < 0) throw new Error('Invalid limit');
    if (Number.isNaN(offset) || offset < 0) throw new Error('Invalid offset');
    if (isVerified && typeof isVerified !== 'boolean')
      throw new Error('Invalid isVerified');
    if (role && !['admin', 'basic', 'premium'].includes(role)) {
      throw new Error('Invalid role');
    }

    if (limit) this.limit = Number(limit);
    if (offset) this.offset = Number(offset);
    if (role) this.role = role;
  }
}

module.exports = QueryVO;
