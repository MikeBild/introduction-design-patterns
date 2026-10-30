export type Reply = { status: number; body?: unknown }
export type Next = () => Promise<Reply>
export type Handler<Req> = (request: Req, next: Next) => Promise<Reply>

export const chain =
  <Req>(...handlers: Handler<Req>[]) =>
  (request: Req): Promise<Reply> => {
    const run = async (index: number): Promise<Reply> => {
      const handler = handlers[index]
      return handler ? handler(request, () => run(index + 1)) : { status: 404 }
    }
    return run(0)
  }
