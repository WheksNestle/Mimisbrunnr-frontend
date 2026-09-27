import useSWR from 'swr';
import { getAll } from '../../../api';
import AsyncData from '../../../components/Common/AsyncData/AsyncData';
import UserList from '../../../components/UserList/UserList';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import { useEffect, useState } from 'react';
import SelectField from '../../../components/Form/SelectField/SelectField';

const LustrumCommites = () => {
  const { data: years = { years: [] }, error: yearsError, isLoading: yearsAreLoading } = useSWR(
    'praesidium/lustrum/years', getAll);

  const [year, setYear] = useState(null);

  useEffect(() => {
    if (years?.years?.length > 0 && !year) {
      setYear(years.years[0]);
    }
  }, [years, year]);

  const { data: praesidium = { lustrumLids: [] }, error: praesidiumError, isLoading: praesidiumIsLoading } = useSWR(
    year ? `praesidium/lustrum/${year}` : null,
    getAll,
  );

  return (
    <div className="container-sm-tm">
      <Breadcrumbs children={[{ link: 'praesidium' }, { link: 'lustrumcommites', isLast: true }]} />
      <h1>Lustrumcomité</h1>
      <AsyncData loading={yearsAreLoading} error={yearsError}>
        <SelectField label={'Kies een jaar:'} options={years.years} value={year} onChange={setYear} />
      </AsyncData>
      <AsyncData loading={praesidiumIsLoading} error={praesidiumError}>
        <UserList users={praesidium.lustrumLids} endpoint={'praesidium/lustrum/members'} />
      </AsyncData>
    </div>
  );
};

export default LustrumCommites;