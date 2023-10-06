import { Octokit } from 'octokit'

export default class FetchGithubRepos {
  octokit: any = null
  owner: string = ''
  totalPage: number = 0
  currPage: number = 0

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token })
  }

  setOwner(repoOwner: string) {
    this.owner = repoOwner
  }

  getOwner() {
    return this.owner
  }

  getTotalPage(pageInfoStr: string) {
    const lastInfo = pageInfoStr.match(/<([^>]+)>;\s*rel="last"/)
    if (lastInfo && lastInfo[1]) {
      const params = new URL(lastInfo[1]).searchParams
      this.totalPage = Number(params.get('page'))
    }
  }

  async getList(page: number) {
    if (this.totalPage && page > this.totalPage) {
      console.log('last page')
      return null
    }
    try {
      const { data, headers } = await this.octokit.request('GET /users/{owner}/repos?page={page}', {
        owner: this.owner,
        page: page,
        per_page: 10,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/vnd.github+json'
        }
      })

      this.currPage = page

      if (page === 1) {
        this.getTotalPage(headers.link)
      }

      return data
    } catch (err) {
      console.log(err)
    }
  }

  async getNextPage() {
    return await this.getList(this.currPage + 1)
  }

  isEnd() {
    return this.totalPage && this.currPage === this.totalPage
  }
}
