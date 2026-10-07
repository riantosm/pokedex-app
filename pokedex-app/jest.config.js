module.exports = {
  preset: '@react-native/jest-preset',
  // Redux Toolkit & dependensinya dikirim sebagai ESM — ikut ditransformasi Babel.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@reduxjs/toolkit|immer|redux|reselect)/)',
  ],
};
