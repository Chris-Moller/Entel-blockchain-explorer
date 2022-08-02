export default class ContractDescriptionObj {
  constructor(
    id,
    author,
    content,
    date,
    contractAddy,
    functionHash,
    upvotes = null,
    downvotes = null
  ) {
    this.id = id;
    this.contractAddy = contractAddy;
    this.functionHash = functionHash;
    this.date = date;
    this.author = author;
    this.content = content;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
  }
}
