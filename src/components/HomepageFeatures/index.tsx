import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  src?: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Secret Pathfinding',
    src: require('@site/static/img/path.png').default,
    description: (
      <>
        Dungeons Guide will show you path to any secret in any room supported
      </>
    ),
  },
  {
    title: 'Smart Routing',
    src: require('@site/static/img/tsp.png').default,
    description: (
      <>
        Dungeons Guide will efficiently generate a single route that visits all secrets within the room, using Traveling Salesman Problem Solver. 
      </>
    ),
  },
  {
    title: 'Powerful Solvers',
    src: require('@site/static/img/solver.png').default,
    description: (
      <>
        All solvers within Dungeons Guide calculates solutions on the fly, even including the one-flow solution in Waterboard puzzle
      </>
    ),
  },
];

function Feature({title, src, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {src != null && (<img src={src} className={styles.featureSvg} role="img" />)}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
