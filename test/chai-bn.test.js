const BN = require('bn.js');
const chai = require('chai');
const expect = chai.expect;

chai.should();
chai.use(require('../chai-bn')(BN));
chai.config.includeStack = true;

describe('chai-bn', function () {
  const customMessage = 'Custom message';
  const customMessageRegex = /^Custom message:/;
  const actualMatchInvalidError = /to be an instance of BN/;
  const expectedMatchInvalidError = /to be an instance of BN or string/;

  const testerGenerator = function (functionNames) {
    return [
      function (a, b, msg) {
        functionNames.forEach(functionName => {
          if (msg) {
            a.should.be.a.bignumber.that[functionName](b, msg);
            expect(a).to.be.a.bignumber.that[functionName](b, msg);
          } else {
            a.should.be.a.bignumber.that[functionName](b);
            expect(a).to.be.a.bignumber.that[functionName](b);
          }
        });
      },

      function (a, b, msg) {
        functionNames.forEach(functionName => {
          if (msg) {
            a.should.not.be.a.bignumber.that[functionName](b, msg);
            expect(a).to.not.be.a.bignumber.that[functionName](b, msg);
          } else {
            a.should.not.be.a.bignumber.that[functionName](b);
            expect(a).to.not.be.a.bignumber.that[functionName](b);
          }
        });
      }
    ];
  };

  const argTypeChecker = function (tester, notTester) {
    it('fails when first argument is not BN or string', function () {
      const testCases = [
        [10, '10'],
        [-10, '-10'],
        [123456789123456789123456789, '123456789123456789123456789'],
        [-123456789123456789123456789, '-123456789123456789123456789'],
      ];

      testCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(actualMatchInvalidError);
        (() => notTester(a, b)).should.throw(actualMatchInvalidError);
      });
    });

    it('fails when second argument is not BN or string', function () {
      const testCases = [
        [new BN('10'), 10],
        [new BN('-10'), -10],
        [new BN('123456789123456789123456789'), 123456789123456789123456789],
        [new BN('-123456789123456789123456789'), -123456789123456789123456789],
      ];

      testCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw(expectedMatchInvalidError);
        (() => notTester(a, b)).should.throw(expectedMatchInvalidError);
      });
    });
  };

  const toBNCombinations = function (a, b) {
    return [
      [a, b],
      [new BN(a), b],
      [a, new BN(b)],
      [new BN(a), new BN(b)],
    ];
  };

  describe('equal/equals/eq', function () {
    const [tester, notTester] = testerGenerator(['equal', 'equals', 'eq']);
    const equalTestCases = [
      ...toBNCombinations('10', '10'),
      ...toBNCombinations('-10', '-10'),
      ...toBNCombinations('123456789123456789123456789', '123456789123456789123456789'),
      ...toBNCombinations('-123456789123456789123456789', '-123456789123456789123456789'),
    ];
    const notEqualTestCases = [
      ...toBNCombinations('10', '9'),
      ...toBNCombinations('-10', '-9'),
      ...toBNCombinations('123456789123456789123456789', '123456789123456789123456788'),
      ...toBNCombinations('-123456789123456789123456789', '-123456789123456789123456788'),
    ];
    it('asserts equality', function () {
      equalTestCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts inequality', function () {
      notEqualTestCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    it('equal fails on inequality', function () {
      notEqualTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not equal fails on equality', function () {
      equalTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, 'Custom message')).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('above/gt/greaterThan', function () {
    const [tester, notTester] = testerGenerator(['above', 'gt', 'greaterThan']);
    const aboveTestCases = [
      ...toBNCombinations('15', '10'),
      ...toBNCombinations('15', '-10'),
      ...toBNCombinations('-10', '-15'),

      ...toBNCombinations('123456789123456789', '123456789123'),
      ...toBNCombinations('123456789123456789', '-123456789123'),
      ...toBNCombinations('-123456789123', '-123456789123456789'),
    ];

    const notAbovetestCases = [
      ...toBNCombinations('10', '15'),
      ...toBNCombinations('-10', '15'),
      ...toBNCombinations('-15', '-10'),
      ...toBNCombinations('-15', '15'),
      ...toBNCombinations('-15', '-15'),

      ...toBNCombinations('123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123456789', '-123456789123'),
    ];

    it('asserts aboveness', function () {
      aboveTestCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unaboveness', function () {
      notAbovetestCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    it('above fails on unaboveness', function () {
      notAbovetestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not above fails on aboveness', function () {
      aboveTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('least/gte', function () {
    const [tester, notTester] = testerGenerator(['gte']);
    const atLeastTestCases = [
      ...toBNCombinations('15', '15'),
      ...toBNCombinations('15', '-10'),
      ...toBNCombinations('-10', '-15'),
      ...toBNCombinations('15', '15'),
      ...toBNCombinations('-15', '-15'),

      ...toBNCombinations('123456789123456789', '123456789123456789'),
      ...toBNCombinations('123456789123456789', '-123456789123'),
      ...toBNCombinations('-123456789123', '-123456789123456789'),
      ...toBNCombinations('123456789123456789', '123456789123456789'),
      ...toBNCombinations('-123456789123456789', '-123456789123456789'),
    ];

    const notAtLeastTestCases = [
      ...toBNCombinations('10', '15'),
      ...toBNCombinations('-10', '15'),
      ...toBNCombinations('-15', '-10'),

      ...toBNCombinations('123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123456789', '-123456789123'),
    ];

    it('asserts at least', function () {
      atLeastTestCases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.a.bignumber.that.is.at.least(b);
        expect(a).to.be.a.bignumber.that.is.at.least(b);
      });
    });

    it('asserts not at least', function () {
      notAtLeastTestCases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.a.bignumber.that.is.at.least(b);
        expect(a).to.not.be.a.bignumber.that.is.at.least(b);
      });
    });

    it('at least fails fails on unaboveness', function () {
      notAtLeastTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('at most fails on aboveness', function () {
      atLeastTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('below/lt/lessThan', function () {
    const [tester, notTester] = testerGenerator(['below', 'lt', 'lessThan']);
    const belowTestCases = [
      ...toBNCombinations('10', '15'),
      ...toBNCombinations('-10', '15'),
      ...toBNCombinations('-15', '-10'),

      ...toBNCombinations('123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123456789', '-123456789123'),
    ];

    const notBelowTestCases = [
      ...toBNCombinations('15', '10'),
      ...toBNCombinations('15', '-10'),
      ...toBNCombinations('-10', '-15'),
      ...toBNCombinations('15', '15'),
      ...toBNCombinations('-15', '-15'),

      ...toBNCombinations('123456789123456789', '123456789123'),
      ...toBNCombinations('123456789123456789', '-123456789123'),
      ...toBNCombinations('-123456789123', '-123456789123456789'),
      ...toBNCombinations('123456789123456789', '123456789123456789'),
      ...toBNCombinations('-123456789123456789', '-123456789123456789'),
    ];

    it('asserts belowness', function () {
      belowTestCases.forEach(([a, b]) => {
        tester(a, b);
      });
    });

    it('asserts unbelowness', function () {
      notBelowTestCases.forEach(([a, b]) => {
        notTester(a, b);
      });
    });

    it('below fails on unbelowness', function () {
      notBelowTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not below fails on belowness', function () {
      belowTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('most/lte', function () {
    const [tester, notTester] = testerGenerator(['lte']);
    const atMostTestCases = [
      ...toBNCombinations('10', '15'),
      ...toBNCombinations('-10', '15'),
      ...toBNCombinations('-15', '-10'),
      ...toBNCombinations('15', '15'),
      ...toBNCombinations('-15', '-15'),

      ...toBNCombinations('123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123', '123456789123456789'),
      ...toBNCombinations('-123456789123456789', '-123456789123'),
      ...toBNCombinations('123456789123456789', '123456789123456789'),
      ...toBNCombinations('-123456789123456789', '-123456789123456789'),
    ];
    const notAtMostTestCases = [
      ...toBNCombinations('15', '10'),
      ...toBNCombinations('15', '-10'),
      ...toBNCombinations('-10', '-15'),

      ...toBNCombinations('123456789123456789', '123456789123'),
      ...toBNCombinations('123456789123456789', '-123456789123'),
      ...toBNCombinations('-123456789123', '-123456789123456789'),
    ];

    it('asserts at most', function () {
      atMostTestCases.forEach(([a, b]) => {
        tester(a, b);
        a.should.be.a.bignumber.that.is.at.most(b);
        expect(a).to.be.a.bignumber.that.is.at.most(b);
      });
    });

    it('asserts not at most', function () {
      notAtMostTestCases.forEach(([a, b]) => {
        notTester(a, b);
        a.should.not.be.a.bignumber.at.most(b);
        expect(a).to.not.be.a.bignumber.at.most(b);
      });
    });

    it('at most fails on not at most input', function () {
      notAtMostTestCases.forEach(([a, b]) => {
        (() => tester(a, b)).should.throw();
        (() => tester(a, b, customMessage)).should.throw(customMessageRegex);
        (() => a.should.be.a.bignumber.at.most(b, customMessage)).should.throw(customMessageRegex);
        (() => expect(a).to.be.a.bignumber.at.most(b, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not at most fails on at most input', function () {
      atMostTestCases.forEach(([a, b]) => {
        (() => notTester(a, b)).should.throw();
        (() => notTester(a, b, customMessage)).should.throw(customMessageRegex);
        (() => a.should.not.be.a.bignumber.at.most(b, customMessage)).should.throw(customMessageRegex);
        (() => expect(a).to.not.be.a.bignumber.at.most(b, customMessage)).should.throw(customMessageRegex);
      });
    });

    argTypeChecker(tester, notTester);
  });

  describe('closeTo', function () {
    const tester = function (a, b, delta, customMessage) {
      a.should.be.a.bignumber.closeTo(b, delta, customMessage);
      expect(a).to.be.a.bignumber.closeTo(b, delta, customMessage);
    };

    const notTester = function (a, b, delta, customMessage) {
      a.should.be.a.bignumber.not.closeTo(b, delta, customMessage);
      expect(a).to.be.a.bignumber.not.closeTo(b, delta, customMessage);
    };
    const closeTestCases = [
      [new BN('15'), '15', '0'],
      [new BN('15'), '10', '5'],
      [new BN('15'), '20', '5'],
      [new BN('-15'), '-15', '0'],
      [new BN('-15'), '-10', '5'],
      [new BN('-15'), '-20', '5'],
      [new BN('123456789123456789'), '123456789123456789', '0'],
      [new BN('123456789123456789'), '123456789123456780', '9'],
      [new BN('123456789123456789'), '123456789123456798', '9'],
      [new BN('-123456789123456789'), '-123456789123456789', '0'],
      [new BN('-123456789123456789'), '-123456789123456780', '9'],
      [new BN('-123456789123456789'), '-123456789123456798', '9'],
    ];
    const notCloseTestCases = [
      [new BN('15'), '14', '0'],
      [new BN('15'), '9', '5'],
      [new BN('15'), '21', '5'],
      [new BN('-15'), '-16', '0'],
      [new BN('-15'), '-9', '5'],
      [new BN('-15'), '-21', '5'],
      [new BN('123456789123456789'), '123456789123456788', '0'],
      [new BN('123456789123456789'), '123456789123456779', '9'],
      [new BN('123456789123456789'), '123456789123456799', '9'],
      [new BN('-123456789123456789'), '-123456789123456788', '0'],
      [new BN('-123456789123456789'), '-123456789123456779', '9'],
      [new BN('-123456789123456789'), '-123456789123456799', '9'],
    ];

    it('asserts closeness', function () {
      closeTestCases.forEach(([a, b, delta]) => {
        tester(a, b, delta);
        (() => notTester(a, b, delta)).should.throw;
      });
    });

    it('asserts not closeness', function () {
      notCloseTestCases.forEach(([a, b, delta]) => {
        notTester(a, b, delta);
        (() => tester(a, b, delta)).should.throw;
      });
    });

    it('close fails on not closeness', function () {
      notCloseTestCases.forEach(([a, b, delta]) => {
        (() => tester(a, b, delta)).should.throw();
        (() => tester(a, b, delta, customMessage)).should.throw(customMessageRegex);
      });
    });

    it('not close fails on closeness', function () {
      closeTestCases.forEach(([a, b, delta]) => {
        (() => notTester(a, b, delta)).should.throw();
        (() => notTester(a, b, delta, customMessage)).should.throw(customMessageRegex);
      });
    });
  });

  describe('negative', function () {
    const tester = function (a) {
      a.should.be.a.bignumber.that.is.negative;
      expect(a).to.be.a.bignumber.that.is.negative;
    };

    const notTester = function (a) {
      a.should.not.be.a.bignumber.that.is.negative;
      expect(a).to.not.be.a.bignumber.that.is.negative;
    };

    it('asserts negativity', function () {
      const testCases = [
        new BN('-1'),
        new BN('-1234856789123456789'),
      ];

      testCases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unnegativity', function () {
      const testCases = [
        new BN('0'),
        new BN('1'),
        new BN('1234856789123456789'),
      ];

      testCases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not BN or string', function () {
      const testCases = [
        -5,
        0,
        5,
      ];

      testCases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });

  describe('zero', function () {
    const tester = function (a) {
      a.should.be.a.bignumber.that.is.zero;
      expect(a).to.be.a.bignumber.that.is.zero;
    };

    const notTester = function (a) {
      a.should.not.be.a.bignumber.that.is.zero;
      expect(a).to.not.be.a.bignumber.that.is.zero;
    };

    it('asserts zeroness', function () {
      const testCases = [
        new BN('0'),
      ];

      testCases.forEach((a) => {
        tester(a);
      });
    });

    it('asserts unzeroness', function () {
      const testCases = [
        new BN('1'),
        new BN('-1'),
        new BN('123456789123456789'),
        new BN('-123456789123456789'),
      ];

      testCases.forEach((a) => {
        notTester(a);
      });
    });

    it('fails when argument is not BN or string', function () {
      const testCases = [
        -5,
        0,
        5,
      ];

      testCases.forEach((a) => {
        (() => tester(a)).should.throw(actualMatchInvalidError);
        (() => notTester(a)).should.throw(actualMatchInvalidError);
      });
    });
  });
});
