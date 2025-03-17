export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true
  },
  async onSuccess(event, { user, tokens }) {
    await setUserSession(event, {
      user: {
        provider: 'github',
        id: String(user.id),
        name: user.name || user.login,
        avatar: user.avatar_url,
        email: user.email,
      },
    })
    return sendRedirect(event, '/')
  },
  // Optional, will return a json error and 401 status code by default
  // onError(event, error) {
  //   console.error('GitHub OAuth error:', error)
  //   return sendRedirect(event, '/login')
  // },
})
