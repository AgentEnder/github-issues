module.exports = function ({ types: t }) {
    return {
      visitor: {
        VariableDeclarator(path) {
          if (path.node.id.name === 'message') {
            path.node.init = t.stringLiteral('prod plugin');
          }
        },
      },
    };
  };
  