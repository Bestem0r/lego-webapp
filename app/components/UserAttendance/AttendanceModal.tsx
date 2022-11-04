import { Component } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { ProfilePicture } from 'app/components/Image';
import styles from './AttendanceModal.css';
import { flatMap } from 'lodash';
import Button from '../Button';
type Pool = {
  name: string;
  registrations: Array<Record<string, any>>;
};
export type Props = {
  pools: Array<Pool>;
  title: string;
  togglePool: (arg0: number) => void;
  selectedPool: number;
  allRegistrations?: Array<Record<string, any>>;
};

const Tab = ({ name, index, activePoolIndex, togglePool }: any) => (
  <Button
    flat
    onClick={() => togglePool(index)}
    className={cx(
      styles.navButton,
      activePoolIndex === index && styles.activeItem
    )}
  >
    {name}
  </Button>
);

type State = {
  pools: Array<
    /*TODO: Pool*/
    Record<string, any>
  >;
};

class AttendanceModal extends Component<Props, State> {
  state = {
    pools: [],
  };
  static defaultProps = {
    title: 'Status',
  };

  // eslint-disable-next-line
  componentWillMount() {
    this.generateAmendedPools(this.props.pools, this.props.allRegistrations);
  }

  generateAmendedPools = (
    pools: Array<Pool>,
    allRegistrations?: Array<Record<string, any>>
  ) => {
    if (pools.length === 1)
      return this.setState({
        pools,
      });
    const registrations = // $FlowFixMe
      allRegistrations || flatMap(pools, (pool) => pool.registrations);
    const summaryPool = {
      name: 'Alle',
      registrations,
    };
    return this.setState({
      pools: [summaryPool, ...pools],
    });
  };

  render() {
    const { title, togglePool, selectedPool } = this.props;
    const { pools } = this.state;
    const activePool = pools[selectedPool];
    return (
      <div>
        <h2>{title}</h2>
        <ul className={styles.list}>
          {activePool.registrations.map((registration, i) => (
            <li key={registration.id}>
              <div className={styles.row}>
                <ProfilePicture size={30} user={registration.user} />
                <Link to={`/users/${registration.user.username}`}>
                  {registration.user.fullName}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.nav}>
          {pools.map((pool, i) => (
            <Tab
              name={pool.name}
              key={i}
              index={i}
              activePoolIndex={selectedPool}
              togglePool={togglePool}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default AttendanceModal;