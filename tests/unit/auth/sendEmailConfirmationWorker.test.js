jest.mock(
  '../../../api/src/infrastructure/adapters/email/nodemailerAdapter',
  () => ({
    sendEmail: jest.fn(),
  }),
);

const {
  processEmailJob,
} = require('../../../api/src/infrastructure/queues/workers/email.process');
const nodemailerAdapter = require('../../../api/src/infrastructure/adapters/email/nodemailerAdapter');
const { sendVerificationEmailName } = require('../../../api/utils/constants');

describe('emailWorker', () => {
  test('should send verification email when job is valid', async () => {
    const mockResponse = {
      message: 'Mail sent',
    };
    const mockSendEmail = nodemailerAdapter.sendEmail;
    mockSendEmail.mockResolvedValueOnce(mockResponse);

    const mockJob = {
      name: sendVerificationEmailName,
      data: {
        email: 'test@example.com',
        name: 'Test User',
        token: '12345',
      },
    };

    const result = await processEmailJob(mockJob);

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockJob.data.email,
        subject: expect.stringContaining('Verification'),
        html: expect.stringContaining(mockJob.data.token),
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  test('should throw if job name is unknown', async () => {
    const mockJob = {
      name: 'unknown-job',
      data: {},
    };

    await expect(processEmailJob(mockJob)).rejects.toThrow(/Unknown job name/);
  });
});
