jest.mock('cloudinary', () => ({
  v2: {
    api: {
      ping: jest.fn((cb) => cb(null, { status: 'ok' })),
    },
    uploader: {
      upload: jest.fn(() =>
        Promise.resolve({ url: 'http://mocked-url.com/image.jpg' }),
      ),
      destroy: jest.fn(() => Promise.resolve({ result: 'ok' })),
    },
    config: jest.fn(),
  },
}));
