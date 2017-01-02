import supertest from 'supertest-as-promised'
import testHelpers from './test-helpers'

describe('Server route definitions', () => {
  beforeAll(testHelpers.startServer)
  afterAll(testHelpers.stopServer)

  it('Should return the api documentation index.html', async () => {
    const res = await supertest(testHelpers.getServer())
      .get('/api/ext/apidoc/index.html')

    expect(res.status).toEqual(200)
  })

  it('Should serve static asssets like images', async () => {
    const res = await supertest(testHelpers.getServer())
      .get('/images/favicon-150.png')

    expect(res.status).toEqual(200)
  })
  /** TODO 21.11.2016 - Ville Heikkinen

  This case probably should have an actual test, but no sensible approach
  has been found yet

  it('Should return the application front page', async () => {
    const res = await supertest(testHelpers.getServer()).get('/')
    expect(res.text).toMatch(/<title>Urapalvelu<\/title>/)
  })

  */
})
