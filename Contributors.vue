<template>
  <div class="contributors" v-show="contributors.length">
    <span>{{ label }}</span>
    <a
      v-for="{ username, id } in contributors"
      :key="id"
      :href="`https://github.com/${username}`"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        :src="`https://avatars.githubusercontent.com/u/${id}?s=32`"
        :alt="username"
      />
    </a>
  </div>
</template>

<script>
import ky from 'ky'

export default {
  name: 'Contributors',
  data: () => ({
    contributors: [],
  }),
  computed: {
    label() {
      return this.$themeLocaleConfig.contributorsLabel || this.$page.contributors.label || 'Contributors'
    }
  },
  watch: {
    $route: {
      handler({ path }, prev) {
        if (typeof window === 'undefined' || (prev && path === prev.path))
          return

        this.contributors.length = 0

        const { docsRepo, docsBranch, docsDir } = this.$page.contributors
        const [user, repo] = docsRepo.split('/')

        ky('https://github-file-contributors.vercel.app/api', {
          searchParams: {
            user,
            repo,
            tree: docsBranch,
            path: `${docsDir ? `${docsDir}/` : ''}${this.$page.relativePath}`,
          },
        })
          .json()
          .then((data) => (this.contributors = data))
          .catch((e) => console.error(e))
      },
      immediate: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.contributors
  max-width: 740px
  margin: 0 auto
  padding: .75rem 2.5rem

  @media (max-width: 959px)
    &
      padding: .75rem 2rem

  @media (max-width: 419px)
    &
      padding: .75rem 1.5rem

  span,
  img
    margin-right: .5rem

  span
    display: inline-block
    transform: translateY(-.5rem)
    color: lighten($textColor, 25%)
    font-weight: 500

  img
    width: 2rem
    border-radius: 100%
</style>
