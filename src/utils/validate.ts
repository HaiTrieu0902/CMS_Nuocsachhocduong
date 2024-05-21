export const validateMessages = {
  required: 'This field is required.',
  whitespace: 'This field is required.',
  types: {
    email: 'Email is invalid.',
  },
};

export const rulePassword = [
  { required: true, message: `Mật khẩu không được để trống.` },
  {
    pattern: /^[^-\s]{6,30}$/,
    message: `Mật khẩu từ 6 ký tự đến 30 ký tự.`,
  },
];

export const rulePasswordFull = [
  { required: true },
  {
    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,30}$/,
    message: `Password must be at least 8 characters long (no space) and contain at least one uppercase, one lowercase and a number.`,
  },
];
