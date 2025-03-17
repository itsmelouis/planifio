export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn, fetch } = useUserSession();
  await fetch();
  if (!loggedIn.value) {
    console.log("User is not logged in, redirecting to login page");
    return await navigateTo("/login");
  }
});
