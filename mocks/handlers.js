import { rest } from 'msw'

export const handlers = [
  rest.post('https://www.fortymm.com/api/v1/users', (req, res, ctx) => {
    const { user } = JSON.parse(req.body)
    return res(
      ctx.status(201),
      ctx.json({
        data: {
          type: 'users',
          id: '6150f42e-1849-419d-9d0f-d85e81a7d28c',
          attributes: {
            username: user.username,
          },
        },
      })
    )
  }),
]
