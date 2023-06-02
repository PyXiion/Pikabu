import { Stack } from "../utils.mjs"
import { PikabuComment } from "./comment.mjs"

class PikabuCommentTree {
  /**
   * 
   * @param {PikabuComment[]} comments 
   */
  constructor(comments) {
    this.children = []
    this.id = 0

    /**
     * @type {Stack<PikabuComment>}
     */
    let commentStack = new Stack();
    commentStack.push(this)

    for (const comment of comments) {
      let previous = commentStack.peek()

      // Поиск родителя
      while (previous.id != comment.parent_id) {
        commentStack.pop()
        previous = commentStack.peek()
      }

      commentStack.push(comment)
      previous.children.push(comment)
      continue
    }
  }
}

export { PikabuCommentTree }