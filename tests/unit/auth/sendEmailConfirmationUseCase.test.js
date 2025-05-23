jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const jwt = require('jsonwebtoken');

const SendEmailConfirmationUseCase = require('../../../api/src/application/use-cases/auth/sendEmailConfirmationUseCase');
const {
  createUser,
  mockJobWithBullMQ,
} = require('../../fake-data/fake-entities');

describe('SendEmailConfirmationUseCase', () => {
  let userData;
  let payload;
  let fakeToken;
  let mockAuthRedis;
  let mockEmailQueue;
  let sendEmailConfirmationUseCase;
  let jobResponse;
  let successfulResponse;

  beforeEach(() => {
    userData = createUser();
    payload = {
      sub: userData.id,
      role: userData.role,
    };
    fakeToken = 'fake-token';
    successfulResponse = 'Email queued';
    jobResponse = mockJobWithBullMQ();

    mockAuthRedis = {
      saveTokenInRedis: jest.fn(),
    };

    mockEmailQueue = {
      sendVerificationEmail: jest.fn(),
    };

    sendEmailConfirmationUseCase = new SendEmailConfirmationUseCase(
      {
        AuthRedis: mockAuthRedis,
      },
      {
        emailQueueService: mockEmailQueue,
      },
    );
  });

  test('It should return a successful message', async () => {
    jwt.sign.mockReturnValue(fakeToken);
    mockAuthRedis.saveTokenInRedis.mockResolvedValue('OK');
    mockEmailQueue.sendVerificationEmail.mockResolvedValue(jobResponse);

    const result = await sendEmailConfirmationUseCase.execute(userData);

    expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {
      expiresIn: '30min',
    });
    expect(mockEmailQueue.sendVerificationEmail).toHaveBeenCalledWith({
      email: userData.email,
      name: userData.name,
      token: fakeToken,
    });
    expect(mockAuthRedis.saveTokenInRedis).toHaveBeenCalledWith(
      userData.id,
      fakeToken,
    );
    expect(result.message).toEqual(successfulResponse);
    expect(result.token).toEqual(fakeToken);
  });

  test('It should return an error because user not found', async () => {
    try {
      await sendEmailConfirmationUseCase.execute({ id: null });

      expect(jwt.sign).not.toHaveBeenCalled();
      expect(mockEmailQueue.sendVerificationEmail).not.toHaveBeenCalled();
      expect(mockAuthRedis.saveTokenInRedis).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(/User not found/);
    }
  });

  test('It should return an error because Redis failed', async () => {
    jwt.sign.mockReturnValue(fakeToken);
    mockAuthRedis.saveTokenInRedis.mockResolvedValue('ERROR');
    mockEmailQueue.sendVerificationEmail.mockResolvedValue(jobResponse);

    try {
      await sendEmailConfirmationUseCase.execute(userData);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(mockAuthRedis.saveTokenInRedis).toHaveBeenCalledTimes(1);
      expect(mockEmailQueue.sendVerificationEmail).not.toHaveBeenCalled();
    } catch (error) {
      expect(error.message).toMatch(
        /Something went wrong saving the token in Redis/,
      );
    }
  });

  test('It should return an error because the queue failed', async () => {
    jwt.sign.mockReturnValue(fakeToken);
    mockAuthRedis.saveTokenInRedis.mockResolvedValue('OK');
    mockEmailQueue.sendVerificationEmail.mockResolvedValue('ERROR');

    try {
      await sendEmailConfirmationUseCase.execute(userData);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(mockAuthRedis.saveTokenInRedis).toHaveBeenCalledTimes(1);
      expect(mockEmailQueue.sendVerificationEmail).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error.message).toMatch(/Something went wrong queuing the email/);
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
