import Image from 'next/image';

import loaderImage from './loader.gif';

import styles from './loader.module.css';

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <Image src={loaderImage} alt="await" width={200} height={200} priority />
    </div>
  );
};
