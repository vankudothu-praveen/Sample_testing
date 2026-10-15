#pragma once
#include <memory>
#include <spdlog/logger.h>

namespace studentrecords {
class Logger {
public:
    [[nodiscard]] static std::shared_ptr<spdlog::logger> instance();
};
} // namespace studentrecords
