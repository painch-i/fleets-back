import { Navigate, Route, Routes } from 'react-router';

import { ChatPage } from '@/features/chat/routes/Chat.route';
import { CurrentFleetProvider } from '@/features/fleets/providers/current-fleet.provider';
import { FleetPage } from '@/features/fleets/routes/Fleet.route';
import Members from '@/features/fleets/routes/Members.route';
import { Fleet } from '@/features/fleets/types/fleet.types';

type FleetRouterProps = {
  fleet: Fleet;
  isFetching: boolean;
};

export const FleetRouter = ({ fleet, isFetching }: FleetRouterProps) => (
  <CurrentFleetProvider fleet={fleet} isFetching={isFetching}>
    <Routes>
      <Route path="/" element={<FleetPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/request" element={<Members />} />
      <Route path="*" element={<Navigate to="/fleet" replace />} />
    </Routes>
  </CurrentFleetProvider>
);
