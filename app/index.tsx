import { web } from '@/shared/variables';
// import Slider from '@/components/board/slider/slider';
import Registration from '@/components/registration/registration';

export default function Index({ }) {
    return (
        // <Slider />
        web() ? `Home Page` : <Registration />
    )
}