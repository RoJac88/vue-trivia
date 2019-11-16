interface QCard {
  id?: number,
  category?: string,
  prompt?: string,
  choices?: Array<string>,
  correct?: string
}

export { QCard }
