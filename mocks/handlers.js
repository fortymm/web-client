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
  rest.post('https://www.fortymm.com/api/v1/sessions', (_req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          type: 'session',
          attributes: {
            userId: 'a57e0288-2e93-4a50-aa70-b170a1273366',
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: 'a57e0288-2e93-4a50-aa70-b170a1273366',
                attributes: {
                  username: 'some-username',
                },
              },
            },
          },
        },
      })
    )
  }),
]
