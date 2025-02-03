class Tree {
  root = null;
  constructor(array) {
    this.array = Collection.makeUnique(array.sort((a, b) => a - b));
  }
  buildTree(array = this.array, start = 0, end = array.length - 1) {
    if (start > end) return null;
    let mid = Math.ceil((start + end) / 2);
    const left = this.buildTree(array, start, mid - 1);
    const right = this.buildTree(array, mid + 1, end);
    this.root = new Node(array[mid], left, right);
    return new Node(array[mid], left, right);
  }
  prettyPrint = (node = this.root, prefix = "", isLeft = true) => {
    if (node === null) return;
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };
  insert(value, node = this.root) {
    if (node === null) return new Node(value);
    if (node.data === value) return node;
    if (value < node.data) node.left = this.insert(value, node.left);
    if (value > node.data) node.right = this.insert(value, node.right);
    return node;
  }
  delete(value, node = this.root) {
    if (!node) {
      return node;
    }
    if (value < node.data) {
      node.left = this.delete(value, node.left);
    } else if (value > node.data) {
      node.right = this.delete(value, node.right);
    } else {
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }
      let curr = node.right;
      while (curr.left) {
        curr = curr.left;
      }
      node.data = curr.data;
      node.right = this.delete(curr.data, node.right);
    }
    return node;
  }
  find(value) {
    let queue = [this.root];
    while (queue.length !== 0) {
      let head = queue[0];
      if (head.left !== null && head.right !== null) {
        queue.push(head.left, head.right);
      } else if (head.left !== null && head.right === null) {
        queue.push(head.left);
      } else if (head.left === null && head.right !== null) {
        queue.push(head.right);
      }
      let currentNode = queue.shift();
      if (currentNode.data === value) {
        return currentNode;
      }
    }
    return null;
  }
  levelOrder(callback) {
    if (typeof callback !== "function") Warning.showError();
    let queue = [this.root];
    while (queue.length !== 0) {
      let head = queue[0];
      if (head.left !== null && head.right !== null) {
        queue.push(head.left, head.right);
      } else if (head.left !== null && head.right === null) {
        queue.push(head.left);
      } else if (head.left === null && head.right !== null) {
        queue.push(head.right);
      }
      let currentNode = queue.shift();
      currentNode.data = callback(currentNode.data);
      console.log(currentNode);
    }
  }
  inOrder(callback) {
    if (typeof callback !== "function") Warning.showError();
    let stack = [];
    let arr = [];
    let currentNode = this.root;
    while (currentNode !== null || stack.length !== 0) {
      while (currentNode !== null) {
        stack.push(currentNode);
        arr.push(currentNode.data);
        currentNode = currentNode.left;
      }
      currentNode = stack.pop();
      currentNode.data = callback(currentNode.data);
      currentNode = currentNode.right;
    }
    return arr;
  }
  preOrder(callback) {
    if (typeof callback !== "function") Warning.showError();
    let stack = [this.root];
    while (stack.length !== 0) {
      let currentNode = stack.pop();
      if (currentNode.right !== null) {
        stack.push(currentNode.right);
      }
      if (currentNode.left !== null) {
        stack.push(currentNode.left);
      }
      currentNode.data = callback(currentNode.data);
      console.log(currentNode.data);
    }
  }
  postOrder(callback) {
    if (typeof callback !== "function") Warning.showError();
    let stack1 = [this.root];
    let stack2 = [];
    while (stack1.length !== 0) {
      let currentNode = stack1.pop();
      stack2.push(currentNode);
      if (currentNode.left !== null) {
        stack1.push(currentNode.left);
      }
      if (currentNode.right !== null) {
        stack1.push(currentNode.right);
      }
    }
    while (stack2.length !== 0) {
      let currentNode = stack2.pop();
      currentNode.data = callback(currentNode.data);
      console.log(currentNode.data);
    }
  }
  height(node) {
    if (node === null) {
      return -1;
    }
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return 1 + Math.max(leftHeight, rightHeight);
  }
  depth(node, root = this.root, currentDepth = 0) {
    if (root === null) {
      return null;
    }
    if (node.data === root.data) {
      return currentDepth;
    }
    const leftSubtree = this.depth(node, root.left, currentDepth + 1);
    if (leftSubtree !== null) {
      return leftSubtree;
    }
    return this.depth(node, root.right, currentDepth + 1);
  }
  isBalanced(root = this.root) {
    return (
      root === null ||
      (this.isBalanced(root.left) &&
        this.isBalanced(root.right) &&
        Math.abs(this.height(root.left) - this.height(root.right)) <= 1)
    );
  }
  rebalance() {
    // The traversal method doesn't really matter you can use any of the four
    const array = this.inOrder((n) => n + 0);
    this.buildTree(array);
  }
}

class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Warning {
  static showError() {
    throw new Error("A callback is required");
  }
}

class Collection {
  static makeUnique(array) {
    let uniqueValues = [];
    for (let i = 0; i < array.length; i++) {
      if (!List.find(array[i], uniqueValues)) {
        uniqueValues.push(array[i]);
      }
    }
    return uniqueValues;
  }
}

class List {
  static find(value, array) {
    for (let i = 0; i < array.length; i++) {
      if (value === array[i]) {
        return true;
      }
    }
    return false;
  }
}

// Unbalanced tree
const secondTree = new Tree([1]);
secondTree.buildTree();
secondTree.root.left = new Node(2);
secondTree.root.left.left = new Node(3);
secondTree.root.left.left.left = new Node(5);
secondTree.root.left.left.left.left = new Node(6);
secondTree.root.right = new Node(7);
secondTree.prettyPrint();
console.log(secondTree.isBalanced());

// Rebalanced tree
const tree = new Tree([1]);
tree.buildTree();
tree.root.left = new Node(2);
tree.root.left.left = new Node(3);
tree.root.left.left.left = new Node(5);
tree.root.left.left.left.left = new Node(6);
tree.root.right = new Node(7);
tree.rebalance();
tree.prettyPrint();
console.log(tree.isBalanced());
