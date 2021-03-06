import React from 'react'

import { withSsr } from 'utils'

import Grid from './Grid'

import styles from './index.scss'

const Home = () => (
  <main className={styles.main}>
    {[
      {
        title: 'GitHub',
        link: 'https://github.com/JounQin',
        className: 'github',
      },
      {
        title: 'Rubick',
        text: 'Vue SSR + TS',
        link: 'https://rubick.1stg.me/',
        className: 'rubick',
      },
      {
        title: 'React Hackernews',
        text: 'View React HN',
        link: 'https://react-hn.now.sh',
        className: 'react-hn',
      },
      {
        title: 'My Blog',
        text: 'Personal website',
        link: 'http://blog.1stg.me',
        className: 'blog',
      },
    ].map((info, index) => (
      <Grid key={index} {...info} />
    ))}
  </main>
)

export default withSsr(styles, false)(Home)
