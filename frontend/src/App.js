import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Discover from '@/pages/Discover';
import MeetDetail from '@/pages/MeetDetail';
import SubmitMeet from '@/pages/SubmitMeet';

export default function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Discover />} /><Route path="/meet/:id" element={<MeetDetail />} /><Route path="/submit" element={<SubmitMeet />} /><Route path="*" element={<Discover />} /></Routes></BrowserRouter>;
}
