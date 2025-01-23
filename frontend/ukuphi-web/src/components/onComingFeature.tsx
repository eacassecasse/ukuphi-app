import { TypeAnimation } from 'react-type-animation'

export default function OnComingFeature() {
    return (
        <div className="w-full flex flex-col flex-1 justify-center items-center text-center px-4 space-y-4">
            <TypeAnimation sequence={
                [
                    'Still in development...',
                    1000,
                    'Please check back later!',
                    2000
                ]
            } wrapper='span'
                cursor={true}
                speed={25}
                style={{ fontSize: '2rem', display: 'inline-block' }}
                repeat={Infinity} />
        </div>
    )
}
